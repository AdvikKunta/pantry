"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  CameraAlt,
  Remove,
  PlayArrow,
  Stop,
  AddAPhoto,
} from "@mui/icons-material/";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { Nunito } from "next/font/google";
import { startCamera, takePicture, stopCamera } from "./camera";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700"] });

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [openCam, setOpenCam] = useState(false);
  const handleOpenCam = () => setOpenCam(true);
  const handleCloseCam = () => setOpenCam(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  const exportData = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const filterInventory = async (search) => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const filteredInventoryList = [];
    docs.forEach((doc) => {
      if (
        doc.id.slice(0, search.length).toLowerCase() === search.toLowerCase()
      ) {
        filteredInventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      }
    });
    setInventory(filteredInventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    } else {
      console.log("Doc doesn't exist");
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    // main box whole page
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      {/* modal stuff */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
          }}
          width={500}
          bgcolor="white"
          borderRadius="30px"
          border="2px solid #E3AC2B"
          boxShadow={50}
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={3}
        >
          <Typography variant="h4" className={nunito.className}>
            Add Item to Your Pantry
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              sx={{
                width: "75%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                },
              }}
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#E3752B",
                border: "1px solid",
                borderColor: "#E3752B",
                "&:hover": {
                  borderRadius: "20px",
                  backgroundColor: "#E3342B",
                  color: "white",
                  borderColor: "#E3342B",
                },
              }}
              onClick={() => {
                if (itemName !== "") {
                  const capitemName = itemName.toLowerCase();
                  addItem(capitemName);
                  setItemName("");
                }
                handleClose();
              }}
            >
              <Typography variant="h6" className={nunito.className}>
                Add
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal open={openCam} onClose={handleCloseCam}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
          }}
          width={500}
          bgcolor="white"
          borderRadius="30px"
          border="2px solid #E3AC2B"
          boxShadow={50}
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={3}
        >
          <video
            ref={videoRef}
            width={400}
            height={300}
            autoPlay
            playsInline
            style={{
              borderRadius: "30px",
              overflow: "hidden",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              display: "none",
              borderRadius: "30px",
              overflow: "hidden",
            }}
          />
          <Box display="flex" flexDirection="row" gap={2}>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#E3752B",
                border: "1px solid",
                borderColor: "#E3752B",
                "&:hover": {
                  borderRadius: "20px",
                  backgroundColor: "#E3342B",
                  color: "white",
                  borderColor: "#E3342B",
                },
              }}
              onClick={() => startCamera(videoRef)}
            >
              <PlayArrow></PlayArrow>
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#E3752B",
                border: "1px solid",
                borderColor: "#E3752B",
                "&:hover": {
                  borderRadius: "20px",
                  backgroundColor: "#E3342B",
                  color: "white",
                  borderColor: "#E3342B",
                },
              }}
              onClick={() => takePicture(videoRef, canvasRef, setImage)}
            >
              <AddAPhoto></AddAPhoto>
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#E3752B",
                border: "1px solid",
                borderColor: "#E3752B",
                "&:hover": {
                  borderRadius: "20px",
                  backgroundColor: "#E3342B",
                  color: "white",
                  borderColor: "#E3342B",
                },
              }}
              onClick={() => stopCamera(videoRef)}
            >
              <Stop></Stop>
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* box for the buttons */}
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems="center"
        // justifyContent="center"
        width="20%"
        height="100%"
      >
        <Typography
          className={nunito.className}
          fontSize="300%"
          textAlign="center"
          fontWeight="75px"
        >
          Pantry Manager
        </Typography>
        <Button
          size="large"
          sx={{
            minHeight: "8vh",
            minWidth: "15vw",
            bgcolor: "#E3752B",
            ":hover": { bgcolor: "#E3342B" },
            borderRadius: "30px",
          }}
          variant="contained"
          onClick={() => {
            router.push("/");
          }}
        >
          <Typography
            className={nunito.className}
            fontSize="200%"
            textTransform={"capitalize"}
          >
            Go Home!
          </Typography>
        </Button>
        <Button
          size="large"
          sx={{
            minHeight: "8vh",
            minWidth: "15vw",
            bgcolor: "#E3752B",
            ":hover": { bgcolor: "#E3342B" },
            borderRadius: "30px",
          }}
          variant="contained"
          onClick={() => {
            router.push("/recipes");
          }}
        >
          <Typography
            className={nunito.className}
            fontSize="200%"
            textTransform={"capitalize"}
          >
            Find Recipes!
          </Typography>
        </Button>
      </Box>
      {/* box for the inventory display + search */}
      <Box border="1px solid #000" width="80%" height="100%" gap={3}>
        {/* specifically the title */}
        <Box
          width="100%"
          height="150px"
          bgcolor="#EBC38D"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h1" className={nunito.className} color="#333">
            Inventory
          </Typography>
        </Box>
        {/* this is for the search bar */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          padding="10px"
        >
          <Box gap={2}>
            <Button
              size="large"
              width="10%"
              height="10%"
              sx={{
                bgcolor: "#E3752B",
                ":hover": { bgcolor: "#E3342B" },
                borderRadius: "30px",
              }}
              variant="contained"
              onClick={() => {
                handleOpen();
              }}
            >
              <Typography
                className={nunito.className}
                fontSize="200%"
                textTransform={"capitalize"}
              >
                Add Item!
              </Typography>
            </Button>
            <Button
              border="1px solid"
              sx={{ borderRadius: "30px" }}
              onClick={handleOpenCam}
            >
              <CameraAlt fontSize="large" sx={{ color: "#EBC38D" }}></CameraAlt>
            </Button>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="50%"
            gap={1}
          >
            <TextField
              variant="outlined"
              height="10%"
              sx={{
                boxShadow: "20px",
                width: "75%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  "&.Mui-focused": {
                    backgroundColor: "#f5f5f5", // Background color when focused
                  },
                },
              }}
              className={nunito.className}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                filterInventory(e.target.value);
              }}
            ></TextField>
            <Button
              width="40px"
              height="400px"
              sx={{
                borderRadius: "30px",
                color: "#E3752B",
              }}
              onClick={() => {
                filterInventory(searchTerm);
              }}
            >
              Go
            </Button>
          </Box>
        </Box>
        {/* this is for the actual display of items */}

        <Stack
          width="100%"
          height="75%"
          spacing={2}
          overflow="auto"
          alignItems="center"
          gap={2}
        >
          {inventory.map(({ name, quantity }) => (
            // box to hold scrolling items
            <Box
              key={name}
              width="90%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderRadius="30px"
              bgcolor="#f0f0f0"
              padding={5}
            >
              {/* this one is for each individual row's name and quantity */}
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                {/* name and quantity */}
                <Typography
                  className={nunito.className}
                  variant="h3"
                  color="#333"
                  textTransform="capitalize"
                >
                  {name}
                </Typography>
                <Typography
                  className={nunito.className}
                  variant="h3"
                  color="#333"
                  paddingRight={2}
                >
                  {quantity}
                </Typography>
              </Box>
              {/* box for the add/remove buttons */}
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  variant=""
                  fontSize="large"
                  display="flex"
                  onClick={() => removeItem(name)}
                >
                  <Remove fontSize="large"></Remove>
                </Button>
                <Button
                  variant=""
                  fontSize="large"
                  display="flex"
                  onClick={() => addItem(name)}
                >
                  <Add fontSize="large"></Add>
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
