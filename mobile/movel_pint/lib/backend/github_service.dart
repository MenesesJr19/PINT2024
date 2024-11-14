import 'package:firebase_auth/firebase_auth.dart';

class GithubService {
  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;

  // Método para login com GitHub
  Future<User?> signInWithGithub() async {
    try {
      GithubAuthProvider githubProvider = GithubAuthProvider();
      UserCredential userCredential = await _firebaseAuth.signInWithProvider(githubProvider);
      return userCredential.user;
    } catch (e) {
      print("Erro ao fazer login com GitHub: $e");
      return null;
    }
  }

  // Método para logout
  Future<void> signOut() async {
    await _firebaseAuth.signOut();
  }

  // Verifica se o usuário está logado
  Stream<User?> get authStateChanges => _firebaseAuth.authStateChanges();
}
