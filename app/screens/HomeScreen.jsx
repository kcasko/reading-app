import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../styles/theme";

export default function HomeScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Reading App</Text>
			<TouchableOpacity
				style={styles.startButton}
				onPress={() => navigation.navigate("Lesson")}
				accessibilityLabel="Start lesson"
			>
				<Text style={styles.startButtonText}>Start</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: theme.colors.background,
		padding: theme.spacing.lg,
	},
	title: {
		fontSize: 34,
		fontWeight: "700",
		marginBottom: theme.spacing.lg,
		color: theme.colors.text,
	},
	startButton: {
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.lg,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	startButtonText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "600",
	},
});
