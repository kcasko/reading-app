import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../styles/theme";

export default function RewardScreen({ navigation }) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Great job!</Text>

			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate("Lesson")}
				accessibilityLabel="Continue to next lesson"
			>
				<Text style={styles.buttonText}>Continue</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.button, styles.homeButton]}
				onPress={() => navigation.navigate("Home")}
				accessibilityLabel="Return home"
			>
				<Text style={styles.buttonText}>Home</Text>
			</TouchableOpacity>
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
	title: {
		fontSize: 32,
		fontWeight: "700",
		marginBottom: theme.spacing.md,
		color: theme.colors.text,
	},
	button: {
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.spacing.md,
		paddingHorizontal: theme.spacing.lg,
		borderRadius: 12,
		marginVertical: theme.spacing.sm,
		width: "70%",
		alignItems: "center",
	},
	homeButton: {
		backgroundColor: theme.colors.muted,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
});
