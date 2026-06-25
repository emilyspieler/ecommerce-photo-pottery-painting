import Form from "../Components/Form";
import { useAuth } from "../Context/AuthContext";

const ContactPage = () => {
  const {user} = useAuth()
  console.log(user)
  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h2>Have a Question?</h2>
        <p>Reach out here! Helpful hint: I love trade for prints. Have a skill or craft you'd like to share in exchange for anything listed? Let's connect!</p>
        <Form />
      </div>
    </div>
  );
};

export default ContactPage;
