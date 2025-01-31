import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  useToast,
  Input,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import useUserStore from "../../store/user";
import SocialLoginButtons from "../../components/SocialLoginButtons";

const RegisterPage = () => {
  const { register, socialLogin } = useUserStore();
  const toast = useToast({
    position: "top-right",
    duration: 5000,
    isClosable: true,
  });

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const registerFn = async () => {
    const { success, message } = await register({ ...userData, role: "user" });

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
    });

    setUserData({ username: "", email: "", password: "" });
  };

  const socialLoginFn = async (provider) => {
    const { success, message } = await socialLogin(provider);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
    });
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Create an account
        </Heading>
        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder={"Full Name"}
              name={"username"}
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
            <Input
              placeholder={"Email"}
              name={"email"}
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />

            <Button colorScheme="blue" onClick={registerFn} w="full">
              Register
            </Button>

            <SocialLoginButtons onSocialLogin={socialLoginFn} />
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default RegisterPage;
