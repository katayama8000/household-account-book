import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

const links = [
  { href: "/sign-in", text: "sign-in" },
  { href: "/sign-up", text: "sign-up" },
  { href: "/modal", text: "modal" },
  { href: "/sample", text: "sample" },
  { href: "/home", text: "home" },
  { href: "/past", text: "past" },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        {links.map((link) => (
          <Link key={link.text} href={link.href} style={styles.link}>
            {link.text}
          </Link>
        ))}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    padding: 20,
  },
  link: {
    color: "blue",
    fontSize: 18,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
