import { ScaledSheet } from "react-native-size-matters";
import { router } from "expo-router";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Images } from "@assets/index";
import { Button, Image, ScreenBox, Text } from "@/components";

export const OtpVerifiedScreen = () => {
  const animScale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animScale.value }],
  }));

  useEffect(() => {
    animScale.value = withSpring(1, { duration: 600 });
  }, []);

  return (
    <ScreenBox justifyContent={"center"}>
      <Animated.View style={animatedStyle}>
        <Image source={Images.success} style={styles.succesImg} />
      </Animated.View>
      <Text variant={"heading"} textAlign={"center"}>
        Account Created
      </Text>
      <Text textAlign={"center"} variant={"body"} mb={"xxl"}>
        Congratulations, you have successfully created an account
      </Text>
      <Button
        label="Proceed to Login"
        onPress={() => router.navigate("/auth/signin")}
      />
    </ScreenBox>
  );
};

const styles = ScaledSheet.create({
  succesImg: {
    width: "150@s",
    height: "auto",
    aspectRatio: 1 / 2,
    alignSelf: "center",
  },
});
