import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Audio} from 'expo-av';
import {gql, useMutation} from "@apollo/client";
import * as FileSystem from "expo-file-system"
import Realm, {objects, write, create} from 'realm'
import {checkInternetConnection} from "react-native-offline"

import {config, localConfig} from "../schema";

const {width, height} = Dimensions.get('screen');

const DOCUMENT_MUTATION = gql`
    mutation upload($filename : String $fileType: String $base64EncodedImage : String) {
        uploadRecording(input: { fileName: $filename, fileType: $fileType, base64EncodedImage: $base64EncodedImage })
    }
`

const CreateRecording = (props) => {
    const [name, setName] = React.useState("");
    const [canRecord, setRecordStatus] = React.useState(false);
    const [record, setRecord] = React.useState(null)
    const [isConnected, setConnected] = React.useState(true)

    const [uploadRecording, {data, error, loading}] = useMutation(DOCUMENT_MUTATION)

    if (error) {
        console.log(error, "error uploading")
    }

    React.useEffect(() => {
        (async () => {
            const connectionStatus = await checkInternetConnection()

            setConnected(connectionStatus)
        })()

    }, [])

    const handleUpload = async (uri) => {
        const connectionStatus = await checkInternetConnection()
        const Recording = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64
        })

        if (!connectionStatus) {
            Realm.open(config)
                .then(instance => {
                    instance.write(() =>
                        instance.create("UserRecordings", {
                            name,
                            link: uri,
                            base64: Recording,
                            dateCreated: new Date()
                        }, "modified")
                    )

                    // return props.navigation.navigate("Home")
                })
                .catch(e => console.log(`Error inserting: ${e}`))
        } else {
            uploadRecording({
                variables: {
                    filename: name,
                    fileType: "m4a",
                    base64EncodedImage: Recording
                }
            }).then((url) => {
                console.log(url, "FILE URL")
                props.navigation.navigate("Home")
            })
                .catch(e => console.log(e))
        }
    }

    const startRecording = async () => {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
            );
            await recording.startAsync();
            setRecord(recording)
            // console.log(recording, 'RECORDING DATA');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        await record.stopAndUnloadAsync();
        const uri = record.getURI();

        handleUpload(uri)
        setRecordStatus(!canRecord)
    }

    return (
        <View style={styles.root}>
            {!isConnected && <View style={[styles.alignCenter, {
                backgroundColor: 'red',
                height: 50,
            }]}>
                <Text style={{
                    color: 'white',
                    textAlign: 'center'
                }}> You device is currently offline, you recordings cant be saved.</Text>
            </View>}

            <View style={styles.alignCenter}>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}> Recording Name </Text>
                    <View style={styles.input}>
                        <TextInput
                            value={name}
                            placeholder="A name for the recording"
                            onChangeText={(value) => setName(value)}
                        />
                    </View>
                </View>

                <View style={{marginVertical: 10}}/>

                <TouchableOpacity
                    disabled={!isConnected}
                    onPress={() => {
                        if (!canRecord) {
                            startRecording()
                            setRecordStatus(!canRecord)
                        } else {
                            stopRecording()
                        }
                    }}
                    style={[
                        styles.button,
                        styles.alignCenter,
                        {
                            backgroundColor: canRecord ? 'red' : '#28BFFD',
                            borderColor: canRecord ? 'red' : '#28BFFD',
                        },
                    ]}>
                    {!canRecord ? (
                        <Text style={{color: '#fff', fontSize: 15}}>
                            Save and Start Recording
                        </Text>
                    ) : (
                        <Text style={{color: '#fff', fontSize: 15}}>Stop Recording</Text>
                    )}
                </TouchableOpacity>

                <View style={[styles.iconContainer, styles.alignCenter]}>
                    {canRecord ? (
                        <View>
                            <Icon name={'ios-mic-outline'} size={85}/>
                        </View>
                    ) : (
                        <Icon
                            name={'md-mic-off-circle-outline'}
                            color={'#c0c0c0'}
                            size={85}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        paddingBottom: 8,
    },
    root: {
        backgroundColor: '#fff',
        height,
    },
    input: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        borderWidth: 0.7,
        borderColor: '#c0c0c0',
        height: 50,
        borderRadius: 7,
        width: width - 25,
    },
    inputContainer: {
        marginTop: 10,
        width: width - 25,
    },
    alignCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
    iconContainer: {
        height: 350,
    },
});

export default CreateRecording;
