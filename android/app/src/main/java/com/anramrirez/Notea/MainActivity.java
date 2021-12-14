package com.anramrirez.Notea;

import com.getcapacitor.BridgeActivity;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import android.os.Bundle;
import com.capacitorjs.plugins.storage.StoragePlugin;
import com.getcapacitor.community.speechrecognition.SpeechRecognition;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstance){
        super.onCreate(savedInstance);

        //Aquí los plugin no oficiales
        registerPlugin(GoogleAuth.class);
        registerPlugin(StoragePlugin.class);
        registerPlugin(SpeechRecognition.class);
    }
}
