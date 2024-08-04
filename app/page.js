"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, HowToVote } from "@mui/icons-material/";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { getExpectedRequestStore } from "next/dist/client/components/request-async-storage.external";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "700"] });

export default function Home() {
  const router = useRouter();

  return (
    <Box display="flex" flexDirection="row">
      <Box
        component="img"
        width="50vw"
        height="100vh"
        src="https://img.freepik.com/premium-vector/hand-drawn-pantry-cartoon-vector-illustration-clipart-white-background_191095-37850.jpg"
      ></Box>
      <Box
        display="flex"
        flexDirection="column"
        width="100vw"
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          className={nunito.className}
          fontSize="600%"
          textAlign="center"
        >
          Pantry Manager
        </Typography>
        <Button
          size="large"
          sx={{
            minHeight: "10vh",
            minWidth: "20vw",
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
            Manage Your Pantry!
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
