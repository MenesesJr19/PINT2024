import 'package:shared_preferences/shared_preferences.dart';

class UserPreferences {
  static final UserPreferences _instance = UserPreferences._internal();
  static const _authTokenKey = 'auth_token';
  late SharedPreferences _prefs;

  factory UserPreferences() {
    return _instance;
  }

  UserPreferences._internal();

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  set authToken(String? token) {
    if (token != null) {
      _prefs.setString(_authTokenKey, token);
    } else {
      _prefs.remove(_authTokenKey);
    }
  }

  String? get authToken => _prefs.getString(_authTokenKey);
}
