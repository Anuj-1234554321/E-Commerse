const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const RandomString = require('randomstring');
const nodeMailer = require('nodemailer');
const { response } = require('../routes/userRoute');
const fs = require('fs').promises;
const create_token =async(id)=>{
 try {
    const token = await jwt.sign({_id:id},config.secret_jwt)
    return token;
    
 } catch (error) {
    res.status(500).send(error.message)
    
 }

}

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        throw new Error('Password hashing failed');
    }
};

const sendResetPassword = async (name,token,email) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.Useremail,
                pass: config.Userpassword,
            },
        });
        

        const mailOptions = {
            from: config.Useremail,
            to: email,
            subject: 'Reset-Password',
            html: `<p>Hello, ${name}, please copy this link <a href="http://localhost:3000/api/reset_password?token=${token}">here</a> and reset your password</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log('The email has been sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send reset password email');
    }
};




const register_user = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).send("User already exists");
            return;
        }

        const hashedPassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            image: req.file.filename,
            mobile: req.body.mobile,
            type: req.body.type
        });

        const savedUser = await user.save();
        res.status(201).send({ success: true, message:"user data successfully saved" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const user_login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Fetch user data from the database
        const user_Data = await User.findOne({ email: email });
        
        if (user_Data) {
            // Compare the provided password with the stored hashed password
            const passwordMatch = await bcrypt.compare(password, user_Data.password);
            const token = await create_token(user_Data._id);

            if (passwordMatch) {
                const userDetails = {
                    _id: user_Data._id,
                    name: user_Data.name,
                    email: user_Data.email,
                    password: user_Data.password,
                    image: user_Data.image,
                    mobile: user_Data.mobile,
                    type: user_Data.type,
                    token: token
                };

                const response = {
                    success: true,
                    msg: "User details",
                    data: userDetails
                };

                res.status(200).send(response);
            } else {
                res.status(400).send("Password does not match");
            }
        } else {
            res.status(400).send("User not found, please register first");
        }
    } catch (error) {
        res.status(500).send("Invalid user login");
    }
};

const update_password = async (req, res) => {
    try {
        const user_id = req.body.user_id;
        const password = req.body.password;

        // Check if user_id or password is missing
        if (!user_id) {
            return res.status(400).send({ success: false, message: "User ID is required" });
        }
        if (!password) {
            return res.status(400).send({ success: false, message: "Password is required" });
        }

        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(400).send({ success: false, message: "User not found" });
        }

        const newPassword = await securePassword(password);
        await User.findByIdAndUpdate(user_id, { password: newPassword });

        return res.status(200).send({ success: true, message: "Your password has been updated successfully" });
    } catch (error) {
        return res.status(500).send({ success: false, message: error.message });
    }
};

const forget_password = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
      
        
        if (userData) {
            const randomString = RandomString.generate();
            await User.updateOne({ email: email }, { $set: { token: randomString } });
            
            try {
                await sendResetPassword(userData.name, randomString, email);
                res.status(200).send({ success: true, message: "Please check your inbox and reset your password." });
            } catch (error) {
                res.status(500).send({ success: false, message: "Failed to send reset password email. Please try again later." });
            }
        } else {
            res.status(400).send({ success: false, message: "This email does not exist." });
        }
    } catch (error) {
        console.error('Error in forget_password:', error);
        res.status(400).send({ success: false, message: error.message });
    }
};

const reset_password = async(req,res)=>{
    try{
        const token = req.body.token;
       const tokenData  = await User.findOne({token:token})
       if(tokenData){
        const password = req.body.password;
        const newPassword = await securePassword(password);
       const userData =  await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword, token:''}},{new:true})
        res.status(400).send({ success: true, message: " User password has been reset successfully", })

       }else{
        res.status(400).send({ success: false, message: "this link has been expired or it may be invalid token" });
       }

    }catch(error){
        res.status(400).send({ success: false, message: error.message });

    }
}
//

const renew_token = async (id) => {
    try {
        const secret_jwt = config.secret_jwt;
        const newSecretjwt = RandomString.generate();

        // Read, replace, and write the config file with promises
        const data = await fs.readFile('config/config.js', 'utf-8',function(error,data){
            if(error) throw error;
            const newValue = data.replace(new RegExp(secret_jwt, "g"), newSecretjwt);
             fs.writeFile('config/config.js', newValue, 'utf-8',function(err,data){
                if(err) throw err;
                console.log('The file has been saved!');
            });

        });
        const token = await jwt.sign({ _id: id },newSecretjwt);
        return token;

    } catch (error) {
        throw new Error(error.message);
    }
}


// refesh_token
const refresh_token = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.body.user_id });
        if (userData) {
            const token = await renew_token(req.body.user_id); 
           const response = 
            res.status(200).send({ success: true, message: "Token renewed successfully", token });

        } else {
            res.status(400).send({ success: false, message: "User not found" });
        }
        
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
}


module.exports = { register_user,user_login,update_password,forget_password,reset_password,refresh_token};
