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
  MenuBook,
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

// logical flow of things:
// open page -> do nothing unless you already have recipes set in the database
// then click button -> generate recipe list by getting ingredients, then add each to database while getting steps, adding all that to another list, then displaying the list
// clear -> delete everything from database, then clear the recipe list and display list

// vars required: list for recipes (recipes), list for display (recipeDisplay), list for ingredients (ingredients)
// funcs required: func to generate ingredients, func to generate recipes, func to add all of them to database, func to add all of them to display

export default function Home() {
  //defining stuff for this page
  const router = useRouter();
  const [ingredient, setIngredient] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [recipeDisplay, setRecipeDisplay] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  //handling open and close of the modals
  const handleOpen = (recipe) => {
    setSelectedRecipe(recipe);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedRecipe(null);
  };

  //whenever array is modified, it does something
  useEffect(() => {
    updateRecipes();
  }, []);

  //takes all the recipes from firebase and adds them to the recipe display, and then sets the display to that
  const updateRecipes = async () => {
    const snapshot = query(collection(firestore, "recipes"));
    const docs = await getDocs(snapshot);
    const recipeDisplay = [];
    docs.forEach((doc) => {
      recipeDisplay.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setRecipeDisplay(recipeDisplay);
  };

  // calls llama model for each recipe and gets instructions and then adds this to firebase
  const addRecipe = async (item) => {
    const docRef = doc(collection(firestore, "recipes"), item);
    const docSnap = await getDoc(docRef);
    const prompt = `"Give me the steps to making this recipe: ${item}, using the ingredients I have (Note: not all will be needed):"`;
    if (!docSnap.exists()) {
      const response = await fetch("../api/llama3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instruction: prompt,
          ingredients: ingredient,
        }),
      });
      const data = await response.json();
      await setDoc(docRef, { steps: data.message });
    }
    await updateRecipes();
  };

  // empties firebase collection of recipes
  const emptyRecipes = async () => {
    const snapshot = query(collection(firestore, "recipes"));
    const docs = await getDocs(snapshot);
    docs.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    await updateRecipes();
  };

  // creates the recipe display array which has name and steps
  const makeRecipes = async () => {
    console.log("recipes: " + recipes);
    recipes.forEach((recipe) => {
      addRecipe(recipe);
    });
    await updateRecipes();
  };

  // gets a list of recipes possible -- first get list of ingredients then call llama
  const getRecipes = async () => {
    await emptyRecipes();
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    docs.forEach((doc) => {
      ingredient.push(doc.id);
    });
    try {
      const response = await fetch("../api/llama3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instruction:
            "Give me a list of potential recipes given these ingredients",
          ingredients: ingredient,
        }),
      });
      const data = await response.json();
      const str = data.message.toLowerCase();
      const re = str.split(", ");
      setRecipes(re);
      await makeRecipes();
    } catch (error) {
      console.error("An error occurred:", error);
    }
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
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
          }}
          width="75vw"
          height="75vh"
          bgcolor="white"
          borderRadius="30px"
          border="2px solid #E3AC2B"
          boxShadow={50}
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="top"
          alignItems="center"
          gap={3}
        >
          {selectedRecipe && (
            <>
              <Box display="flex" flexDirection="row" gap={3}>
                <MenuBook sx={{ fontSize: "4rem" }} />
                <Typography
                  variant="h2"
                  className={nunito.className}
                  textTransform="capitalize"
                >
                  {selectedRecipe.name}
                </Typography>
              </Box>

              <Box width="100%" height="1px" bgcolor="lightgrey" my={2} />
              <Typography
                variant="h4"
                className={nunito.className}
                overflow="auto"
              >
                {selectedRecipe.steps}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems="center"
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
        {/* this is for the buttons */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          padding="10px"
          gap={2}
        >
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
              onClick={() => {
                setIngredient([]);
                getRecipes();
                console.log("display" + recipeDisplay);
              }}
            >
              Generate
            </Typography>
          </Button>
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
              onClick={() => {
                emptyRecipes();
              }}
            >
              Clear Recipes
            </Typography>
          </Button>
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
          {recipeDisplay.map(({ name, steps }) => (
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
              sx={{
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: "rgba(0, 0, 0, 0.1)", // slightly darker shade
                },
              }}
              onClick={() => handleOpen({ name, steps })}
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
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
