module.exports = (ticket) => `
<!DOCTYPE html>
<html>
<head>
<style>
body{
    font-family:Arial,sans-serif;
    background:#f8fafc;
    margin:0;
    padding:20px;
}

.container{
    max-width:600px;
    margin:auto;
    background:#fff;
    border-radius:12px;
    padding:30px;
    box-shadow:0 4px 12px rgba(0,0,0,.08);
}

.header{
    color:#1e40af;
    border-bottom:2px solid #e5e7eb;
    padding-bottom:15px;
}

.ticket-box{
    background:#eff6ff;
    border-left:4px solid #2563eb;
    padding:15px;
    border-radius:8px;
    margin:20px 0;
}

.btn{
    display:inline-block;
    background:#2563eb;
    color:#fff !important;
    text-decoration:none;
    padding:12px 20px;
    border-radius:6px;
    margin-top:10px;
}

.footer{
    margin-top:30px;
    font-size:12px;
    color:#64748b;
}
</style>
</head>

<body>
<div class="container">

<h2 class="header">
🎫 TechCube Support Ticket
</h2>

<p>Hello <strong>${ticket.name}</strong>,</p>

<p>
Your support ticket has been created successfully.
You can track your conversation anytime.
</p>

<div class="ticket-box">
    <strong>Ticket ID:</strong> ${ticket.id}<br>
    <strong>Status:</strong> ${ticket.status.toUpperCase()}
</div>

<a href="https://techcube.in" class="btn">
Open Support Chat
</a>

<div class="footer">
This is an automated email from TechCube.
</div>

</div>
</body>
</html>
`;
