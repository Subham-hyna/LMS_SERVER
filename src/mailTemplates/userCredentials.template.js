const userCredentialsTemplate = (name, email, regNo, password, loginLink) => {
    return `
    <!DOCTYPE html>
    <html>
    
    <head>
        <style>
           .box{
            background-color: #ffffff;
            width: 70%;
            padding: 50px;
           }
           .box>h1{
            margin: 0 auto;
            display: flex;
            justify-content: center;
            font-size: 35px;
            color: #58595d;
            font-weight: 300;
           }
           .box>h3{
            font-size:18px;
            font-weight: bold;
            color: #383838;
           }
           .box>h3>span{
            font-size: 18px;
            color: #383838;
           }
           .box>a{
            width: 200px;
            background-color: #72bd76;
            padding: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;
           }
           .box>a:hover{
            background-color: #3bac3b;
            cursor: pointer;
           }
           .box>p{
            font-size: 16px;
            color: #808080;
           }
           .box>p:nth-child(1){
            font-weight: 600;
           }
           .box>a>button{
            outline: none;
            border: none;
            background-color: inherit;
            color: #ffffff;
            font-size: 16px;
            margin: 0 auto;
           }
           .box>span{
            margin: 0 auto;
            display: flex;
            justify-content: center;
            font-size: 14px;
            color: #58595d;
            color: #9799a7;
           }
        </style>
    </head>
    
    <body>
        <div class="box">
            <h1>Account Credentials</h1>
            <p>Hi, ${name}</p>
            <p>Here is your temporary credentials for your Librarify account</p>
            <h3>Email ID - <span>${email}</span></h3>
            <h3>Registration ID - <span>${regNo}</span></h3>
            <h3>Temporary Password - <span>${password}</span></h3>
            <p>Your Account is successfully created and verified in Librarify. Click below to login</p>
            <a href=${loginLink}><button>Login</button></a>
            <p>Note : Kindly change your password after login by change password or by clicking forgot password</p>
            <span>Love from Librarify Team 💚 </span>
        </div>
    </body>
    
    </html>
    `
}

export default userCredentialsTemplate;