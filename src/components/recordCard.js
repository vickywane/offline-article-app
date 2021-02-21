import * as React from "react";
import { View, Text } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';

import { HomeStyles as styles  } from "../styles"

const RecordingCard = ({data, onPlay}) => (
    <View key={Math.random()} style={[styles.alignCenter]}>
        <View style={styles.post}>
            <View
                onClick={() => onPlay()}
                style={[styles.play, styles.alignCenter
                    , {
                        flexDirection: "column"
                    }]}>
                <Icon size={30} name={"playcircleo"}/>
                <Text style={{fontSize: 14}}> Play </Text>
            </View>

            <View style={[styles.alignCenter, {flexDirection: 'column'}]}>
                <Text style={styles.title}>  {data.name}</Text>
                <Text> Thu 21, 2021</Text>
            </View>

            <View style={[styles.alignCenter, {marginRight: 20}]}>
                <Icon size={22} name={"delete"}/>
            </View>
        </View>
    </View>
)

export default RecordingCard;
