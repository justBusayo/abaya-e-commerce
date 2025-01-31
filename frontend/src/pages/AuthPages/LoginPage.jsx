import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  useColorModeValue,
  VStack,
  useToast,
} from "@chakra-ui/react";
import useUserStore from "../../store/user";

const LoginPage = () => {
  const navigate = useNavigate(); // ✅ Initialize useNavigate
  const { login } = useUserStore();
  const toast = useToast({
    position: "top-right",
    duration: 5000,
    isClosable: true,
  });

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const loginFn = async () => {
    const { success, message } = await login(userData);
    console.log("login", success, message);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
    });

    if (success) {
      setUserData({ email: "", password: "" });
      navigate("/"); // ✅ Redirect to home page
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"}>
          Login
        </Heading>
        <Heading as={"h6"} size={"md"} textAlign={"center"} mb={8}>
          Welcome back! Please login to your account.
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

            <Button colorScheme="blue" onClick={loginFn} w="full">
              Login
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default LoginPage;
