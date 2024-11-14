import 'package:flutter/material.dart';
import 'package:movel_pint/atividade/detalhes_atividade.dart';
import 'package:movel_pint/backend/auth_service.dart';
import 'package:movel_pint/perfil/profile.dart';
import 'package:movel_pint/widgets/bottom_navigation_bar.dart';
import 'package:movel_pint/widgets/customAppBar.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';
import 'package:movel_pint/backend/api_service.dart';

class CalendarScreen extends StatefulWidget {
  @override
  _EventCalendarPageState createState() => _EventCalendarPageState();
}

class _EventCalendarPageState extends State<CalendarScreen> {
  Map<DateTime, List<Map<String, dynamic>>> _events = {};
  List<Map<String, dynamic>> _selectedEvents = [];
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  int _selectedIndex = 1; 
  late int _userId;


  @override
  void initState() {
    _fetch();
    super.initState();
  }
  
  void _fetch() async {
    await _loadUserId();
    await _fetchEventsForUser();
  }

    Future<void> _loadUserId() async {
      dynamic utilizadorAtual = await AuthService.obter();
      setState(() {
        _userId = utilizadorAtual["id"];
      });
    }

  Future<void> _fetchEventsForUser() async {
    try {
      final data = await ApiService.listar('conteudo/participando');

      print("data");
      print(data);
      print("data");

      if (data != null && data is List<dynamic>) {
        Map<DateTime, List<Map<String, dynamic>>> events = {};
        for (var eventData in data) {
          DateTime eventDate = DateTime.parse(eventData['data_evento']).toLocal();
          DateTime eventDay = DateTime(eventDate.year, eventDate.month, eventDate.day);
          if (!events.containsKey(eventDay)) {
            events[eventDay] = [];
          }
          events[eventDay]!.add({
            'id': eventData['id'],
            'titulo': eventData['titulo'],
            'hora': DateFormat.Hm().format(eventDate),
            'descricao': eventData['descricao'],
          });
        }
        
        setState(() {
          _events = events;
          _selectedDay = _focusedDay;
          _selectedEvents = _getEventsForDay(_focusedDay);
        });
      } else {
        print('Dados não encontrados ou inválidos');
      }
    } catch (e) {
      print('Erro ao carregar dados: $e');
    }
  }

  List<Map<String, dynamic>> _getEventsForDay(DateTime day) {
    return _events[DateTime(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(),
      body: Column(
        children: [
          Container(
            color: Colors.grey.shade200, 
            child: TableCalendar(
              firstDay: DateTime.utc(2020, 1, 1),
              lastDay: DateTime.utc(2030, 12, 31),
              focusedDay: _focusedDay,
              selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
              onDaySelected: (selectedDay, focusedDay) {
                setState(() {
                  _selectedDay = selectedDay;
                  _focusedDay = focusedDay;
                  _selectedEvents = _getEventsForDay(selectedDay);
                });
              },
              eventLoader: _getEventsForDay,
              calendarStyle: CalendarStyle(
                todayDecoration: BoxDecoration(
                  color: Colors.grey,
                  shape: BoxShape.circle,
                ),
                selectedDecoration: BoxDecoration(
                  color: Colors.grey,
                  shape: BoxShape.circle,
                ),
                markerDecoration: BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
              ),
              headerStyle: HeaderStyle(
                formatButtonVisible: false,
                titleCentered: true,
              ),
              calendarBuilders: CalendarBuilders(
                markerBuilder: (context, date, events) {
                  if (events.isNotEmpty) {
                    return Positioned(
                      right: 1,
                      bottom: 1,
                      child: _buildEventsMarker(date, events),
                    );
                  }
                  return SizedBox();
                },
                defaultBuilder: (context, date, _) {
                  if (_events.containsKey(DateTime(date.year, date.month, date.day))) {
                    return _buildHighlightedDay(date);
                  }
                  return null;
                },
              ),
            ),
          ),
          const SizedBox(height: 8.0),
          Expanded(
            child: _buildEventList(),
          ),
        ],
        
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildEventsMarker(DateTime date, List<dynamic> events) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.blue,
      ),
      width: 16.0,
      height: 16.0,
      child: Center(
        child: Text(
          '${events.length}',
          style: TextStyle().copyWith(
            color: Colors.white,
            fontSize: 12.0,
          ),
        ),
      ),
    );
  }

  Widget _buildHighlightedDay(DateTime date) {
    return Container(
      margin: const EdgeInsets.all(6.0),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: Colors.lightBlueAccent,
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Text(
        '${date.day}',
        style: TextStyle(
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildEventList() {
    if (_selectedEvents.isEmpty) {
      return Center(child: Text('Nenhum evento para este dia.'));
    }
    return ListView.builder(
      itemCount: _selectedEvents.length,
      itemBuilder: (context, index) {
        final event = _selectedEvents[index];
        return GestureDetector(
          onTap: () {
            _navigateToEventDetails(event['id']);
          },
          child: Card(
            child: ListTile(
              title: Text(event['titulo'], style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('${event['hora']}\n${event['descricao']}'),
            ),
          ),
        );
      },
    );
  }

  void _navigateToEventDetails(int eventId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ActivityDetailsPage(activityId: eventId),
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
}

void main() {
  runApp(MaterialApp(
    home: CalendarScreen(),
    theme: ThemeData(
      primarySwatch: Colors.blue,
      visualDensity: VisualDensity.adaptivePlatformDensity,
    ),
  ));
}
}