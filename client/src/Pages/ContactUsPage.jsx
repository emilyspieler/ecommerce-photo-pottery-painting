import Form from "../Components/Form";
import { useAuth } from "../Context/AuthContext";

const ContactPage = () => {
  const {user} = useAuth()
  console.log(user)
  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h2>Contact Us!</h2>
        <p>We'd love to hear from you</p>
        <Form />
      </div>
    </div>
  );
};

export default ContactPage;
