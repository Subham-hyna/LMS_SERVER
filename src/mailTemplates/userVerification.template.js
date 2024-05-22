const userVerificationLink = (name, emailVerificationLink ,OTP) => {
    return `
    <!DOCTYPE html>
    <html>
    
    <head>
        <style>
           
        </style>
    </head>
    
    <body>
        <div class="wrapper">
            <div class="box">
             <div>
                    <h4 class="end">${name}</h4>
                    <a href=${emailVerificationLink}>Click here</a>
                    <p>${OTP}</p>
                </div>
            </div>
            <div class="box-bottom">
            </div>
        </div>
    </body>
    
    </html>
    `
}

export default userVerificationLink;