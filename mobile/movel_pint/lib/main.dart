import 'package:flutter/material.dart';
import 'package:movel_pint/atividade/criarAtividade.dart';
import 'package:movel_pint/atividade/detalhes_atividade.dart';
import 'package:movel_pint/backend/github_service.dart';
import 'package:movel_pint/espaço/criarespaço.dart';
import 'package:movel_pint/evento/criarEvento.dart';
import 'package:movel_pint/perfil/login.dart';
import 'package:movel_pint/recomedacao/criarRecomendacao.dart';
import 'package:movel_pint/utils/user_preferences.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/widgets/customAppBar.dart';
import 'package:movel_pint/home/homepage.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await UserPreferences().init();
  final userPreferences = UserPreferences();
  String? token = userPreferences.authToken;
  await Firebase.initializeApp();
  
  runApp(MultiProvider(
      providers: [
        Provider<GithubService>(
          create: (_) => GithubService(),
        ),
      ],
      child: MyApp(token: token),
    ),);
  
}

class MyApp extends StatelessWidget {
  final String? token;
  MyApp({required this.token});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: token == null ? LoginPage() : HomePageMain(), 
    );
  }
}

class HomePage1 extends StatefulWidget {
  final int initialIndex; 
  HomePage1({Key? key, this.initialIndex = 0}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage1> {
  int _selectedIndex = 0;
  PageController _pageController = PageController(initialPage: 0);

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _goToEventFormPage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => EventFormPage()),
    );
  }

  void _goToLoginPerfilPage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => EventFormPage()),
    );
  }

  void _goToCreateEspacoPage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => SpaceFormPage()),
    );
  }

  void _goToCreateRecomendacaoPage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => RecomendationFormPage()),
    );
  }

  void _goToCreateAtividadePage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => CreateActivityPage()),
    );
  }

  void _goToDetalheAtividadePage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => ActivityDetailsPage(activityId: 1)),
    );
  }

  void _goToRegisterPage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => LoginApp()),
    );
  }

  void _goToHomePage() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => HomePageMain()),
    );
  }

  void _logout() async {
    UserPreferences().authToken = null;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => LoginPage()),
      (Route<dynamic> route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(), 
      body: SingleChildScrollView(
        child: Center(
          child: Container(
            alignment: Alignment.topCenter,
            child: SizedBox(
              width: 900,
              height: 240,
              child: Stack(
                children: [
                  PageView(
                    controller: _pageController,
                    scrollDirection: Axis.horizontal,
                    children: [
                      Container(
                        width: 300,
                        height: 200,
                        child: Image.network(
                          'https://t4.ftcdn.net/jpg/03/84/55/29/360_F_384552930_zPoe9zgmCF7qgt8fqSedcyJ6C6Ye3dFs.jpg',
                        ),
                      ),
                      Container(
                        width: 300,
                        height: 200,
                        child: Image.network(
                          'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/RE2wSVH_RE4dchU:VP1-539x349?resMode=sharp2&op_usm=1.5,0.65,15,0&qlt=90&fmt=png-alpha',
                        ),
                      ),
                      Container(
                        width: 300,
                        height: 200,
                        child: Image.network(
                          'https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/RE2wSVH_RE4dchU:VP1-539x349?resMode=sharp2&op_usm=1.5,0.65,15,0&qlt=90&fmt=png-alpha',
                        ),
                      ),
                    ],
                  ),
                  /*
                  Positioned(
                    top: 80,
                    left: 1,
                    child: IconButton(
                      icon: Icon(Icons.arrow_back, size: 20),
                      onPressed: _previousPage,
                      color: const Color.fromARGB(255, 255, 255, 255),
                    ),
                  ),
                  Positioned(
                    top: 80,
                    right: 1,
                    child: IconButton(
                      icon: Icon(Icons.arrow_forward, size: 20),
                      onPressed: _nextPage,
                      color: const Color.fromARGB(255, 255, 255, 255),
                      
                    ),
                  ),
                  */
                ],
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(height: 16), 
          ElevatedButton(
            onPressed: _goToEventFormPage,
            child: Text('Criar Novo Evento'),
          ),
          ElevatedButton(
            onPressed: _goToCreateEspacoPage,
            child: Text('Criar Espaço'),
          ),
          ElevatedButton(
            onPressed: _goToCreateRecomendacaoPage,
            child: Text('Criar recomendação'),
          ),
          ElevatedButton(
            onPressed: _goToCreateAtividadePage,
            child: Text('Criar atividade'),
          ),
          ElevatedButton(
            onPressed: _goToDetalheAtividadePage,
            child: Text('Detalhes da Atividade'),
          ),
         /* ElevatedButton(
            onPressed: _goToRegisterPage,
            child: Text('Login'),
          ),*/
          ElevatedButton(
            onPressed: _goToHomePage,
            child: Text('Homepage'),
          ),
          ElevatedButton(
            onPressed: _logout,
            child: Text('Logout'),
          ),
          CustomBottomNavigationBar(
            selectedIndex: _selectedIndex,
            onItemTapped: _onItemTapped,
          ),
        ],
      ),
    );
  }
}
