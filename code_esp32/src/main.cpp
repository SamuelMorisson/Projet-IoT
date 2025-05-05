#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define LED 13
#define BUZZER 12
#define PIR 22


volatile bool motionDetected = false;

// variables modifiées avec messages récupérés dans mqtt
int durationLed = 10000; // durée pendant laquelle la led est allumée
int durationBuzzer = 3000; // durée pendant laquelle le buzzer est allumé
volatile bool activeLed = true; // est-ce que la led doit être allumée
volatile bool activeBuzzer = true; // est-ce que le buzzer doit être allumé

// test boucle
int endActiveLed = 0;
int endActiveBuzzer = 0;
bool activeAlarm = true;


//pour connexion wifi -----------------------------------------------------------------------------
const char* ssid = ""; // nom du réseau wifi
const char* password = ""; // mot de passe
//pour connexion mqtt
const char *mqtt_broker = "broker.emqx.io";
const char *mqtt_topic = "Ynov/Rennes/Mouvtrack";
const int mqtt_port = 1883;
// 
WiFiClient espClient;
PubSubClient client(espClient);
// ------------------------------------------------------------------------------------------------



// fonction pour récupérer message MQTT -----------------------------------------------------------
void callback(char* mqtt_topic, byte* payload, unsigned int length) {
  Serial.print("Message reçu sur le sujet : ");
  Serial.println(mqtt_topic);
  Serial.print("Contenu : ");
  //Serial.print((char)payload);
  for (unsigned int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}
// ------------------------------------------------------------------------------------------------



// fonction appelée lors de la détection de mouvement ---------------------------------------------
void IRAM_ATTR handleMotionDetected() {
  Serial.println("Mouvement détecté !");
  motionDetected = true;
}
// ------------------------------------------------------------------------------------------------








// initialisation du code -------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  
  // connexion au wifi --------------------------
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connexion au WiFi..");
  }
  Serial.println("Connecté au WiFi !");
  // --------------------------------------------


  // connexion au mqtt --------------------------
  client.setCallback(callback); // récupération de message
  client.setServer(mqtt_broker, mqtt_port);
  // tentative de connexion au mqtt
  while (!client.connected()) {
    Serial.println("Connexion au broker MQTT..");
    if (client.connect("client_id")) {
      Serial.println("Connecté au broker MQTT !");
      client.subscribe(mqtt_topic);
    } else {
      Serial.print("Echec de la connexion MQTT !");
      Serial.println(client.state());
      delay(5000);
    }
  }

  // initialisation du buzzer, led et détecteur
  pinMode(LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(PIR, INPUT);
  attachInterrupt(digitalPinToInterrupt(PIR), handleMotionDetected, RISING); // fonction d'interruption pour détection mouvement

  Serial.println("Lancement du code !");
}
// ------------------------------------------------------------------------------------------------



// boucle principale ------------------------------------------------------------------------------
void loop() {

  client.loop();

  // lancé lorsqu'il y a un mouvement
  if (motionDetected) {
    Serial.println("Mouvement détecté, activation de l'alarme !");
    //activeAlarm = true; // commenté car problème détecteur
    //digitalWrite(LED, HIGH);
    //tone(BUZZER, 1000);
    motionDetected = false;
    //delay(1000);

    if (client.connected()) {
      client.publish(mqtt_topic, "Intrusion détectée !");
      Serial.println("Message publié sur le sujet MQTT");
      delay(2000);
    } else {
      Serial.println("Non connecté au broker MQTT");
    }
  }


  /*if (client.connected()) { // test d'envoi de message toute les 5 secondes
    client.publish(mqtt_topic, "Intrusion détectée test !");
    //Serial.println("Message publié sur le sujet MQTT");
    delay(5000);
  } else {
    Serial.println("Non connecté au broker MQTT");
  }*/




  // gestion de la boucle pour la durée de l'alarme (LED + buzzer)
  if (activeAlarm == true) { // activé à l'initialisation du code
    activeAlarm = false;
    if (activeLed == true) {
      endActiveLed = millis() + durationLed;
      digitalWrite(LED, HIGH);
    } else {Serial.print("LED désactivée !");}

    if (activeBuzzer == true) {
      endActiveBuzzer = millis() + durationBuzzer;
      tone(BUZZER, 1000);
    } else {Serial.print("Buzzer désactivé !");}
  }

  if (millis() >= endActiveLed && endActiveLed != 0) {
    endActiveLed = 0; // reset de la variable pour éviter que la led ne s'éteigne plusieurs fois
    digitalWrite(LED, LOW);
    Serial.print("La LED s'éteint !");
  }
  if (millis() >= endActiveBuzzer && endActiveBuzzer != 0) {
    endActiveBuzzer = 0;
    noTone(BUZZER); // pour le moment commenté car erreur: LEDC not initialized
    Serial.print("Le Buzzer s'éteint !");
  }



  // test du timer de la led
  //int testTime = millis();
  //Serial.println(testTime);










  // désactivation du buzzer et led après mouvement
  //digitalWrite(LED, LOW);
  //noTone(BUZZER);
  //delay(1000);


  //test += 1; // pour connaître le nombre de boucles
  //Serial.println(test);
}


