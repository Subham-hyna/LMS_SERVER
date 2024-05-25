const userCredentialsTemplate = (email, regNo, password) => {
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
                    <h4 class="end">${email} ${regNo}</h4>
                    <p> Password is ${password}</p>

                </div>
            </div>
            <div class="box-bottom">
            </div>
        </div>
    </body>
    
    </html>
    `
}

export default userCredentialsTemplate;