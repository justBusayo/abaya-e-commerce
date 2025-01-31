import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { BiLogInCircle } from "react-icons/bi";
import { LuSun } from "react-icons/lu";
import { useEffect } from "react";
import useUserStore from "../store/user"; // Import the user store

const Navbar = () => {
  const token = localStorage.getItem("token");
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, user, initialize, logout } = useUserStore();

  useEffect(() => {
    if (token) {
      initialize();
    }
  }, [token, initialize]);

  const handleLogout = async () => {
    await logout();
  };

  console.log("User details", user);
  return (
    <Container maxW={"1140px"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{ base: "column", sm: "row" }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
        >
          <Link to={"/"}>Abaya Factory 🛒</Link>
        </Text>
        <HStack spacing={2} alignItems={"center"}>
          {user?.role === "admin" && (
            <Link to={"/create"}>
              <Button>
                <PlusSquareIcon fontSize={20} />
              </Button>
            </Link>
          )}
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon size="20" /> : <LuSun size="20" />}
          </Button>

          {!isAuthenticated ? <Link to={"/register"}>Register</Link> : null}

          <Link to={"/login"}>
            {isAuthenticated ? (
              <Button onClick={handleLogout} leftIcon={<CiLogout size="20" />}>
                Logout
              </Button>
            ) : (
              <Button leftIcon={<BiLogInCircle size="20" />}>Login</Button>
            )}
          </Link>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
