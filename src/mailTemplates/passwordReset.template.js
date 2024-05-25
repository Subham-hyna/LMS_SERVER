const passwordResetMail = (name , resetLink) => {
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
                <h4 class="end">Hi ${name},</h4>
                <p>We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
                <p>To reset your password, click the following link:</p>
                <p><a href="${resetLink}">click here</a></p>
                <p class="end"><i>This link is valid for the next 24 hours. After that, you'll need to request another password reset.</i></p>
            </div>
        </div>
        <div class="box-bottom">
        </div>
    </div>
</body>

</html>
`
};

export { passwordResetMail };

