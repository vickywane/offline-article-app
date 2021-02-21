import Realm from "realm"
import mongoose from 'mongoose'

import {REALM_ID} from "./credentials";

const RealmInstance = new Realm.App({id: REALM_ID})
const {currentUser} = RealmInstance

const RecordingSchema = {
    name: "VoiceRecordingss",
    properties: {
        _id: {type: 'objectId', default: mongoose.Types.ObjectId()}  ,
        name: "string",
        link: "string",
        createdBy: { type: 'string', default: currentUser.profile.email },
        dateCreated: {type: "date", default: new Date()}
    },
   primaryKey: '_id',
}

export const config = {
    schema: [RecordingSchema],
    schemaVersion: 2,
    sync: {
        user: currentUser,
        partitionValue: 'name'
    }
}

export const localConfig = {
    schema: [RecordingSchema],
    schemaVersion: 2,
    path: Realm.defaultPath,
}
