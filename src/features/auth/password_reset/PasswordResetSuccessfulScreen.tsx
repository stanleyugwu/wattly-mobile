import { router } from "expo-router";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ScaledSheet } from "react-native-size-matters";

import { Images } from "@assets/index";
import { Button, Image, ScreenBox, Text } from "@/components";

export const PasswordResetSuccessfulScreen = () => {
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
        Password reset{"\n"}successful!
      </Text>
      <Text textAlign={"center"} variant={"body"} mb={"xxl"} mt={"m"}>
        Congratulations, you have successfully set a new password for your
        account
      </Text>
      <Button
        label="Proceed to login"
        onPress={() => router.dismissTo("/auth/signin")}
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
