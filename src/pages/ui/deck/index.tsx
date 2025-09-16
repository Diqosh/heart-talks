import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
    Avatar,
    IconButton,
    Chip,
    Divider, type SelectChangeEvent,
} from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {PART1, PART2, PART3, PART4} from "../../helpers/constants.ts";



type CategoryKey = 'part1' | 'part2' | 'part3' | 'part4';

const ALL: Record<CategoryKey, string[]> = {
    part1: PART1,
    part2: PART2,
    part3: PART3,
    part4: PART4,
};

export default function DimashkaQaraqatApp() {
    const [category, setCategory] = useState<CategoryKey>('part1');

    const [pools, setPools] = useState<Record<CategoryKey, string[]>>({
        part1: [...ALL.part1],
        part2: [...ALL.part2],
        part3: [...ALL.part3],
        part4: [...ALL.part4],
    });

    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const current = historyIndex === null ? null : history[historyIndex];

    const handleCategoryChange = (e: SelectChangeEvent) => {
        const val = e.target.value as CategoryKey;
        setCategory(val);
        // reset history view when switching category
        setHistory([]);
        setHistoryIndex(null);
    };

    const drawRandom = () => {
        const pool = pools[category];
        if (!pool || pool.length === 0) return;
        const idx = Math.floor(Math.random() * pool.length);
        const question = pool[idx];

        // remove from pool
        const newPool = pool.slice(0, idx).concat(pool.slice(idx + 1));
        setPools(prev => ({ ...prev, [category]: newPool }));

        // add to history and set current index to newest
        setHistory(prev => {
            const next = [...prev, question];
            setHistoryIndex(next.length - 1);
            return next;
        });
    };

    const resetCategory = () => {
        setPools(prev => ({ ...prev, [category]: [...ALL[category]] }));
        setHistory([]);
        setHistoryIndex(null);
    };

    const showPrevious = () => {
        if (historyIndex === null) return;
        if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
    };

    const showNext = () => {
        if (historyIndex === null) return;
        if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
    };

    const remainingCount = pools[category].length;

    const prettyCategoryLabel = useMemo(() => {
        switch (category) {
            case 'part1':
                return '1 level';
            case 'part2':
                return '2 level';
            case 'part3':
                return 'Boss level';
            case 'part4':
                return 'increadable level';
        }
    }, [category]);

    return (
        <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
            <Card elevation={6} sx={{ borderRadius: 3, overflow: 'visible' }}>
                <CardHeader
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>DQ</Avatar>}
                    title={<Typography variant="h6">Dimashka & Qaraqat</Typography>}
                    subheader={<Typography variant="caption">Вечер вопросов</Typography>}
                    action={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip label={prettyCategoryLabel} />
                        </Box>
                    }
                />

                <CardContent>
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel id="category-label">Emotion level :)</InputLabel>
                            <Select
                                labelId="category-label"
                                value={category}
                                label="Emotion level :)"
                                onChange={handleCategoryChange}
                            >
                                <MenuItem value="part1">Разогрев ⛅ (Small Talk Mode)</MenuItem>
                                <MenuItem value="part2">Доверие.exe 🛠 (установка близости)</MenuItem>
                                <MenuItem value="part3">Оу... так неловкооо 💔 (но это сближает)</MenuItem>
                                <MenuItem value="part4">Философский космос 🌌 (глубокие мысли)</MenuItem>
                            </Select>
                        </FormControl>

                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                            <Typography variant="body2">Осталось вопросов в категории: {remainingCount}</Typography>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    startIcon={<ShuffleIcon />}
                                    onClick={drawRandom}
                                    disabled={remainingCount === 0}
                                >
                                    Достать вопрос
                                </Button>

                                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={resetCategory}>
                                    Сбросить категорию
                                </Button>
                            </Stack>
                        </Stack>

                        <Divider />

                        <Box
                            sx={{
                                minHeight: 140,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                p: 2,
                            }}
                        >
                            {current ? (
                                <Typography variant="h6">{current}</Typography>
                            ) : (
                                <Typography color="text.secondary">Нажмите «Достать вопрос», чтобы начать</Typography>
                            )}
                        </Box>

                        <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton onClick={showPrevious} disabled={historyIndex === null || historyIndex <= 0}>
                                <ArrowBackIosNewIcon />
                            </IconButton>
                            <IconButton
                                onClick={showNext}
                                disabled={historyIndex === null || historyIndex >= (history.length - 1)}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Stack>

                        <Divider />

                        <Box>
                            <Typography variant="subtitle2">История вопросов</Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                {history.map((_q, idx) => (
                                    <Chip
                                        key={idx}
                                        label={`#${idx + 1}`}
                                        size="small"
                                        onClick={() => setHistoryIndex(idx)}
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ))}
                                {history.length === 0 && <Typography color="text.secondary">Пока нет</Typography>}
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2">❤</Typography>
            </Box>
        </Container>
    );
}
