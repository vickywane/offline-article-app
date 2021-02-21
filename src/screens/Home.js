import * as React from "react";
import {
    View,
    Text,
    FlatList,
    Dimensions,
    ActivityIndicator, TouchableOpacity,
} from "react-native";

import RecordingCard  from "../components/recordCard";
import {useQuery} from "@apollo/client";
import {Audio} from "expo-av"
import {localConfig, config, RecordingSchema} from "../schema";
import Realm from "realm"
import { HomeStyles as styles  } from "../styles"
import {RECORDING_QUERY} from "../graphqlOps";

const {height} = Dimensions.get("screen");

const Home = (props) => {
    const [Recordings, setRecording] = React.useState(null)
    const [dataLoading, setDataLoading] = React.useState(true)
    const [ isPlaying, setPlaying ] = React.useState(false)
    const {data, error, loading} = useQuery(RECORDING_QUERY, {
        pollInterval: 100
    });


    React.useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate("CreateRecording");
                }}>
                    <Text style={{color: "#fff", paddingRight: 10}}> New Recording </Text>
                </TouchableOpacity>
            ),
        });
    }, []);

    React.useEffect(() => {
        if (!loading) {
            if (data) {
                setRecording(data.recordings)
                setDataLoading(false)
            } else {
                Realm.open(localConfig).then(instance => {
                    const records = instance.objects("VoiceRecordingss")

                    // instance.write(() => {
                    //     instance.create('VoiceRecordingss', {
                    //         name: 'Testing-voices',
                    //         link: 'https://github.com',
                    //     })
                    // })

                    setRecording(records)
                    setDataLoading(false)
                }).catch(error => {
                    console.log("open realm err:", error)
                })
            }
        }
    }, [loading])

    const playAudio = async () => {

        const {sound: playbackObject} = await Audio.Sound.createAsync(
            {uri: 'https://res.cloudinary.com/dkfptto8m/video/upload/v1613041645/test/Bella_Shmurda_Ft_Olamide_Vision_2020_Remix_9jaflaver.com_.mp3'},
            {shouldPlay: true}
        );
    }

    if (dataLoading) {
        return (
            <View style={{height, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator color="blue"/>
            </View>
        );
    }

    return (
        <View style={{backgroundColor: "#fff", height}}>
            <FlatList
                data={Recordings}
                keyExtractor={(item) => Math.random().toString()}
                renderItem={({item}) => <RecordingCard onPlay={() => playAudio()} data={item}/>}
            />
        </View>
    );
};

export default Home;
