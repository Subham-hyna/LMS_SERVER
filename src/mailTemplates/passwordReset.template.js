const passwordResetMail = (name , resetLink) => {
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
            font-size: 30px;
            color: #58595d;
            font-weight: 300;
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
            <h1>Password Reset</h1>
            <p>Hi, ${name}</p>
            <p>Seems like you forgot your password for Librarify. If this is true, click below to reset your password.</p>
            <a href=${resetLink}><button>Reset My Password</button></a>
            <p>If you did not forgot your password you can safely ignore this email.</p>
            <span>Love from Librarify Team 💚 </span>
        </div>
    </body>
    
    </html>
`
};

export { passwordResetMail };

