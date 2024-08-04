"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { firestore } from "../../firebase";
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

import { getGroqChatCompletion } from "../api/llama3/route.mjs";

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { items } = req.body;
      const response = await getGroqChatCompletion(items);
      res.status(200).json(response.choices[0]?.message?.content || {});
    } catch (error) {
      res.status(500).json({ error: "Error fetching recipes" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

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
            Recipes
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
            >
              <Typography
                className={nunito.className}
                fontSize="200%"
                textTransform={"capitalize"}
              >
                Generate
              </Typography>
            </Button>
          </Box>
        </Box>
        {/* this is for the actual display of items */}
        {/* edit this for the display of recipes */}
        <Stack
          width="100%"
          height="75%"
          spacing={2}
          overflow="auto"
          alignItems="center"
          gap={2}
        >
          {recipes &&
            Object.keys(recipes).map((dish) => (
              <Box
                key={dish}
                width="90%"
                minHeight="150px"
                display="flex"
                flexDirection="column"
                borderRadius="30px"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography
                  className={nunito.className}
                  variant="h3"
                  color="#333"
                  textTransform="capitalize"
                >
                  {dish}
                </Typography>
                <ul>
                  {recipes[dish].map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </Box>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
