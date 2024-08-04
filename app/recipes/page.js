"use client";
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
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700"] });

export default function Home() {
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
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
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
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
            router.push("/main");
          }}
        >
          <Typography
            className={nunito.className}
            fontSize="200%"
            textTransform={"capitalize"}
          >
            Manage Pantry!
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
