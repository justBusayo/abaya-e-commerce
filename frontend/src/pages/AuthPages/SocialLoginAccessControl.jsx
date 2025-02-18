import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Center } from "@chakra-ui/react";

const SocialLoginAccessControl = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSocialLogin = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("token", token);
        navigate("/"); 
      } else {
        navigate("/login"); // Redirect to login if token is missing
      }
    };

    handleSocialLogin();
  }, [navigate]);

  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
};

export default SocialLoginAccessControl;
