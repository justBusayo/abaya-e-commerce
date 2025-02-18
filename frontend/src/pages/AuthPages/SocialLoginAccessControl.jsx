import { useEffect } from "react";
import { useRouter } from "next/router";
import { Spinner, Center } from "@chakra-ui/react";

const SocialLoginAccessControl = () => {
  const router = useRouter();

  useEffect(() => {
    const handleSocialLogin = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        localStorage.setItem("token", token);
        router.replace("/"); // Redirect to dashboard or home page
      } else {
        router.replace("/login"); // Redirect to login if token is missing
      }
    };

    handleSocialLogin();
  }, [router]);

  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
};

export default SocialLoginAccessControl;
