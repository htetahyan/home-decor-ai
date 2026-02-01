import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { RoomAnalysis } from '../services/geminiService';

// Root Stack Navigator
export type RootStackParamList = {
    Onboarding: undefined;
    SignIn: undefined;
    SignUp: undefined;
    MainTabs: undefined;
    Camera: undefined;
    AIAnalysis: { imageUri: string };
    RedesignPreview: {
        imageUri: string;
        analysis: RoomAnalysis;
        selectedItems: string[];
        style: string;
    };
    Premium: undefined;
    Settings: undefined;
};

// Bottom Tab Navigator
export type MainTabParamList = {
    Home: undefined;
    Explore: undefined;
    Create: undefined;
    Saved: undefined;
    Profile: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<MainTabParamList, T>,
        NativeStackScreenProps<RootStackParamList>
    >;

// Navigation helper types
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
