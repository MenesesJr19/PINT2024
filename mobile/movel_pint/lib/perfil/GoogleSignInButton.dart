import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:ionicons/ionicons.dart';
import 'package:movel_pint/backend/api_service.dart';
import 'package:movel_pint/home/homepage.dart';
import 'package:movel_pint/utils/user_preferences.dart';
class GoogleSignInButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return IconButton(
        icon: Icon(
          Ionicons.logo_google,
          color: Colors.red,
          size: 30,
        ), onPressed: () async {
          await signInWithGoogle(context); // Pass context here
        },
    );
  }

  Future<User?> signInWithGoogle(BuildContext context) async { // Accept context as a parameter
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) {
        return null;
      }

      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      dynamic response = await ApiService.externalLogin(googleAuth.idToken!);
      if (response?['token'] != null) {
        final token = response?['token'];
        if (token != null) {
          UserPreferences().authToken = token;
          Navigator.push(
            context, // Use context here
            MaterialPageRoute(builder: (context) => HomePageMain()),
          );
        }
      }

      final UserCredential userCredential = await FirebaseAuth.instance.signInWithCredential(credential);

      return userCredential.user;
    } catch (e) {
      print(e.toString());
      return null;
    }
  }
}

