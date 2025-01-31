import { HStack, IconButton } from "@chakra-ui/react";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";

const SocialLoginButtons = ({ onSocialLogin }) => {
  return (
    <HStack spacing={4} mt={2}>
      <IconButton
        aria-label="Sign in with Google"
        icon={<FaGoogle />}
        backgroundColor="red.500"
        color="white"
        _hover={{ backgroundColor: "red.600" }}
        rounded="full"
        onClick={() => onSocialLogin("google")}
      />
      <IconButton
        aria-label="Sign in with Facebook"
        icon={<FaFacebook />}
        backgroundColor="#1877F2"
        color="white"
        _hover={{ backgroundColor: "#165CE6" }}
        rounded="full"
        onClick={() => onSocialLogin("facebook")}
      />
      <IconButton
        aria-label="Sign in with Twitter"
        icon={<FaTwitter />}
        backgroundColor="#1DA1F2"
        color="white"
        _hover={{ backgroundColor: "#0D8AEC" }}
        rounded="full"
        onClick={() => onSocialLogin("twitter")}
      />
    </HStack>
  );
};

export default SocialLoginButtons;
