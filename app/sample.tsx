import type React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SwiperView } from "../components/SwiperbleView";

interface CardItem {
  id: string;
  title: string;
}

const SampleScreen: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([
    { id: "1", title: "Card 1" },
    { id: "2", title: "Card 2" },
    { id: "3", title: "Card 3" },
    { id: "4", title: "Card 4" },
  ]);

  const handleSwipeLeft = (id: string) => {
    console.log(`Swiped left on card ${id}`);
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const renderCard = ({ item }: { item: CardItem }) => (
    <SwiperView
      onSwipeLeft={() => handleSwipeLeft(item.id)}
      backView={
        <View style={styles.backView}>
          <Text style={styles.backViewText}>Delete</Text>
        </View>
      }
      style={styles.swipeViewContainer}
    >
      <View style={styles.card}>
        <Text style={styles.cardText}>{item.title}</Text>
      </View>
    </SwiperView>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  listContainer: {
    padding: 16,
  },
  swipeViewContainer: {
    marginBottom: 16,
  },
  backView: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 16,
    borderRadius: 8,
  },
  backViewText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
  },
});

export default SampleScreen;
