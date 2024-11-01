import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface UserData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: number;
}

interface DailyNorms {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

interface MealEntry {
  id: number;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
  }
`;

function App() {
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    age: 0,
    gender: 'male',
    weight: 0,
    height: 0,
    activityLevel: 1.2
  });
  
  const [dailyNorms, setDailyNorms] = useState<DailyNorms>({
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0
  });

  const [mealEntries, setMealEntries] = useLocalStorageState<MealEntry[]>("mealEntries", {
    defaultValue: [],
  });

  const [newMeal, setNewMeal] = useState({
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0
  });

  const calculateDailyNorms = () => {
    // Формула Харриса-Бенедикта
    let bmr = 0;
    if (userData.gender === 'male') {
      bmr = 88.36 + (13.4 * userData.weight) + (4.8 * userData.height) - (5.7 * userData.age);
    } else {
      bmr = 447.6 + (9.2 * userData.weight) + (3.1 * userData.height) - (4.3 * userData.age);
    }
    
    const calories = Math.round(bmr * userData.activityLevel);
    const protein = Math.round(userData.weight * 1.6); // 1.6г белка на кг веса
    const fats = Math.round((calories * 0.3) / 9); // 30% калорий из жиров
    const carbs = Math.round((calories - (protein * 4) - (fats * 9)) / 4); // оставшиеся калории из углеводов

    setDailyNorms({ calories, protein, fats, carbs });
    setShowSecondScreen(true);
  };

  const handleAddMeal = () => {
    if (Object.values(newMeal).some(value => value > 0)) {
      setMealEntries([
        ...mealEntries,
        { id: Date.now(), ...newMeal }
      ]);
      setNewMeal({ calories: 0, protein: 0, fats: 0, carbs: 0 });
    }
  };

  const totals = mealEntries.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    fats: acc.fats + meal.fats,
    carbs: acc.carbs + meal.carbs
  }), { calories: 0, protein: 0, fats: 0, carbs: 0 });

  return (
    <AppContainer>
      {!showSecondScreen ? (
        // Первый экран
        <StyledCard>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Калькулятор нутриентов
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Возраст"
                  type="number"
                  value={userData.age || ''}
                  onChange={(e) => setUserData({ ...userData, age: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Пол</InputLabel>
                  <Select
                    value={userData.gender}
                    onChange={(e) => setUserData({ ...userData, gender: e.target.value as 'male' | 'female' })}
                  >
                    <MenuItem value="male">Мужской</MenuItem>
                    <MenuItem value="female">Женский</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Вес (кг)"
                  type="number"
                  value={userData.weight || ''}
                  onChange={(e) => setUserData({ ...userData, weight: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Рост (см)"
                  type="number"
                  value={userData.height || ''}
                  onChange={(e) => setUserData({ ...userData, height: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Уровень активности</InputLabel>
                  <Select
                    value={userData.activityLevel}
                    onChange={(e) => setUserData({ ...userData, activityLevel: Number(e.target.value) })}
                  >
                    <MenuItem value={1.2}>Сидячий образ жизни</MenuItem>
                    <MenuItem value={1.375}>Легкая активность</MenuItem>
                    <MenuItem value={1.55}>Умеренная активность</MenuItem>
                    <MenuItem value={1.725}>Высокая активность</MenuItem>
                    <MenuItem value={1.9}>Очень высокая активность</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <StyledButton
              variant="contained"
              color="primary"
              fullWidth
              onClick={calculateDailyNorms}
              endIcon={<ArrowForwardIcon />}
            >
              Рассчитать
            </StyledButton>
          </CardContent>
        </StyledCard>
      ) : (
        // Второй экран
        <>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Ваша суточная норма
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body1">
                    Калории: {dailyNorms.calories}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body1">
                    Белки: {dailyNorms.protein}г
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body1">
                    Жиры: {dailyNorms.fats}г
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body1">
                    Углеводы: {dailyNorms.carbs}г
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>

          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Добавить приём пищи
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Калории"
                    type="number"
                    value={newMeal.calories || ''}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Белки (г)"
                    type="number"
                    value={newMeal.protein || ''}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Жиры (г)"
                    type="number"
                    value={newMeal.fats || ''}
                    onChange={(e) => setNewMeal({ ...newMeal, fats: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Углеводы (г)"
                    type="number"
                    value={newMeal.carbs || ''}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                  />
                </Grid>
              </Grid>
              <StyledButton
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddMeal}
              >
                Добавить
              </StyledButton>
            </CardContent>
          </StyledCard>

          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Итого за день
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography color={totals.calories > dailyNorms.calories ? "error" : "inherit"}>
                    Калории: {totals.calories} / {dailyNorms.calories}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography color={totals.protein > dailyNorms.protein ? "error" : "inherit"}>
                    Белки: {totals.protein} / {dailyNorms.protein}г
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography color={totals.fats > dailyNorms.fats ? "error" : "inherit"}>
                    Жиры: {totals.fats} / {dailyNorms.fats}г
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography color={totals.carbs > dailyNorms.carbs ? "error" : "inherit"}>
                    Углеводы: {totals.carbs} / {dailyNorms.carbs}г
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </>
      )}
    </AppContainer>
  );
}

export default App;
