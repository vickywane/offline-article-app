import {StyleSheet} from "react-native";
import { Dimensions} from "react-native"

const { width  } = Dimensions.get("screen")

export const HomeStyles = StyleSheet.create({
    error: {
        backgroundColor: 'red',
        height: 50,
        color: 'white',
        textAlign: 'center'
    },
    play: {
        borderWidth: .5,
        borderColor: "#c0c0c0",
        width: '25%'
    },

    title: {
        fontWeight: '500',
        color: "black",
        fontSize: 17
    },

    btnText: {
        fontSize: 15,
        color: '#fff'
    },

    img: {
        height: 250,
        width: width - 5,
        borderRadius: 5,
    },
    alignCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    posts: {
        display: "flex",
        flexDirection: "column",
    },
    post: {
        width: width - 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#c0c0c0",
        display: "flex",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 100,
        marginVertical: 10,
    },
    button: {
        borderColor: '#28BFFD',
        backgroundColor: '#28BFFD',
        height: 47,
        width: width - 25,
        borderWidth: 1,
        color: '#fff',
        fontSize: 16,
        borderRadius: 5,
    },
});
