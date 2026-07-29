namespace P20_Tran.DTO
{
    public class LoginDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class EmailRequest
    {
        public string Email { get; set; }
    }

    public class OtpRequest
    {
        public string Email { get; set; }
        public string Otp { get; set; }
    }

    public class PasswordUpdateRequest
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
    }

}
