import { Component, ElementRef, ViewChild } from '@angular/core';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { LatLng } from '@capacitor-community/capacitor-googlemaps-native/dist/esm/types/common/latlng.interface';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map') mapView: ElementRef;

  constructor(private alertCtrl: AlertController) {}

  ionViewDidEnter() {
    this.createMap();
  }

  createMap() {
    const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
    // console.log("🚀 ~ file: home.page.ts ~ line 21 ~ HomePage ~ createMap ~ boundingRect", boundingRect);

    CapacitorGoogleMaps.create({
      width: Math.round(boundingRect.width),
      height: Math.round(boundingRect.height),
      x: Math.round(boundingRect.x),
      y: Math.round(boundingRect.y),
      zoom: 2,


      latitude:53.3498, // you can get the location and add the latitude
      longitude:6.2603 // you can get the location and add the longitude

    });

    CapacitorGoogleMaps.addListener('onMapReady', async () => {
      
      CapacitorGoogleMaps.setMapType({
        type:'normal'
        // type:'hybrid'
      });
        this.showCurrentPosition();

        CapacitorGoogleMaps.addListener('didTapPOIWithPlaceID', async (ev) => {
          const result = ev.results;

          const alert = await this.alertCtrl.create({
            header: result.name,
            message: `Place ID: ${result.placeID}`,
            buttons: ['OK']
          });

          await alert.present();

        });



    });

  } 

  showCurrentPosition() {
    Geolocation.requestPermissions().then(async permission => {
      const coordinates = await Geolocation.getCurrentPosition();

      CapacitorGoogleMaps.addMarker({
        latitude: coordinates.coords.latitude,
        // latitude: -33.86,
        longitude: coordinates.coords.longitude,
        // longitude: 151.20,
        title: 'My castle of loneliness',
        snippet: 'Come and find me!'
      });

      CapacitorGoogleMaps.setCamera({
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        zoom: 12,
        bearing: 0
      });

    });
  }


  draw() {
    const points: LatLng [] = [
      {
        latitude: 51.88,
        longitude: 7.60,
      },
      {
        latitude: 55,
        longitude: 10,
      }
    ];

    CapacitorGoogleMaps.addPolyline({
    points,
    color: '#ff00ff',
    width: 2
    });

  }

}
