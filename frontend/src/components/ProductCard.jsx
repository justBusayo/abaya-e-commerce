import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { useState } from "react";
import ProductModal from "./ProductModal";
import useUserStore from "../store/user";

const ProductCard = ({ product }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteProduct, updateProduct } = useProductStore();
  const {user} = useUserStore();

  const [updatedProduct, setUpdatedProduct] = useState(product);

  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  const toast = useToast({
    position: "top-right",
    duration: 3000,
    isClosable: true,
  });

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    if (success) {
      toast({
        title: "Success",
        description: message,
        status: "success",
      });
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
      });
    }
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    const { success, message } = await updateProduct(pid, updatedProduct);
    onClose();
    if (success) {
      toast({
        title: "Success",
        description: "Product updated successfully",
        status: "success",
      });
    } else {
      toast({
        title: "Error",
        description: message,
        status: "error",
      });
    }
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w="full"
        objectFit="cover"
      />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ${product.price}
        </Text>
        {user?.role === "admin" && (
            <HStack spacing={2}>
              <IconButton
                icon={<EditIcon />}
                onClick={() => {
                  onOpen();
                }}
                colorScheme="blue"
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => handleDeleteProduct(product._id)}
                colorScheme="red"
              />
            </HStack>
        )}
      </Box>

      {/* <Modal isOpen={isOpen} onClose={onClose}></Modal> */}
      <ProductModal
        isOpen={isOpen}
        onClose={onClose}
        product={product}
        handleUpdateProduct={handleUpdateProduct}
        updatedProduct={updatedProduct}
        setUpdatedProduct={setUpdatedProduct}
      />
    </Box>
  );
};

export default ProductCard;
