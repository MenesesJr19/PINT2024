import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class GithubAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<User?> signInWithGitHub() async {
    // Crie uma nova instância do provedor de autenticação GitHub
    GithubAuthProvider githubProvider = GithubAuthProvider();

    try {
      // Exibe a tela de login do GitHub
      UserCredential userCredential = await _auth.signInWithProvider(githubProvider);
      return userCredential.user;
    } catch (e) {
      print("Erro durante o login com GitHub: $e");
      return null;
    }
  }

  // Método para deslogar
  Future<void> signOut() async {
    await _auth.signOut();
  }
}
