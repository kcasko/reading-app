import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import imageAssets from "../assets/imageAssets";
import AudioPlayer from "../audio/AudioPlayer";
import WordCard from "../components/WordCard";
import ProgressTracker from "../game/ProgressTracker";
import WordEngine from "../game/WordEngine";
import theme from "../styles/theme";

export default function LessonScreen({ navigation }) {
	const [lesson, setLesson] = useState(null);
	const [choices, setChoices] = useState([]);
	const [locked, setLocked] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(null);
	const [status, setStatus] = useState('idle'); // 'idle' | 'correctSelected' | 'incorrectSelected'
	const [showImage, setShowImage] = useState(false);

	useEffect(() => {
		loadLesson();
	}, []);

	async function loadLesson() {
		const l = await WordEngine.getNextLesson();
		setLesson(l);
		if (!l) return;
		setChoices(l.choices || []);
		// play audio for the target word when lesson loads
		AudioPlayer.play(l.targetWord).catch(() => {});
		setStatus('idle');
		setSelectedIndex(null);
		setShowImage(false);
	}

	async function handleChoicePress(index, choice) {
		if (locked || !lesson) return;
		setSelectedIndex(index);
		setLocked(true);

		if (choice === lesson.targetWord) {
			// correct
			setStatus('correctSelected');
			try {
				const progress = (await ProgressTracker.loadProgress()) || {};
				progress.lessonsCompleted = (progress.lessonsCompleted || 0) + 1;
				progress.totalAnswered = (progress.totalAnswered || 0) + 1;
				progress.totalCorrect = (progress.totalCorrect || 0) + 1;
				await ProgressTracker.saveProgress(progress);
				await ProgressTracker.incrementStreak();
			} catch (e) {
				console.warn(e);
			}

			// show reward image after short delay
			setTimeout(() => {
				setShowImage(true);
			}, 350);

			// navigate after showing image briefly
			setTimeout(() => {
				setLocked(false);
				navigation.navigate('Reward');
			}, 900);
		} else {
			// incorrect
			setStatus('incorrectSelected');
			// play corrective audio for the target word
			AudioPlayer.play(lesson.targetWord).catch(() => {});
			setTimeout(() => {
				setSelectedIndex(null);
				setStatus('idle');
				setLocked(false);
			}, 800);
		}
	}

	if (!lesson) {
		return (
			<View style={styles.container}>
				<Text style={styles.loading}>Loading lesson...</Text>
			</View>
		);
	}

	const rewardImage = lesson.imageKey ? imageAssets[lesson.imageKey] : null;

	return (
		<View style={styles.container}>
			<WordCard word={lesson.targetWord} />

			<View style={styles.choicesContainer}>
				{choices.map((c, idx) => {
					const isSelected = selectedIndex === idx;
					const borderColor = isSelected && status === 'correctSelected' ? theme.colors.success : isSelected && status === 'incorrectSelected' ? theme.colors.error : '#ddd';
					return (
						<TouchableOpacity
							key={c}
							style={[styles.choiceButton, { borderColor }]}
							onPress={() => handleChoicePress(idx, c)}
						>
							<Text style={styles.choiceText}>{c}</Text>
						</TouchableOpacity>
					);
				})}
			</View>

			{showImage && rewardImage ? (
				<View style={styles.rewardContainer}>
					<Image source={rewardImage} style={styles.rewardImage} resizeMode="contain" />
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: theme.spacing.lg,
		backgroundColor: theme.colors.background,
	},
	loading: {
		fontSize: 18,
		color: theme.colors.muted,
	},
	choicesContainer: {
		width: "100%",
		alignItems: "center",
		marginTop: theme.spacing.md,
	},
	choiceButton: {
		width: "90%",
		paddingVertical: theme.spacing.md,
		borderRadius: 12,
		borderWidth: 3,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.colors.background,
		marginVertical: theme.spacing.sm,
	},
	choiceText: {
		fontSize: 22,
		fontWeight: "600",
		color: theme.colors.text,
	},
	rewardContainer: {
		marginTop: theme.spacing.md,
		alignItems: "center",
	},
	rewardImage: {
		width: "60%",
		height: 160,
	},
});
