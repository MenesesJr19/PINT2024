import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'dart:convert'; // Para decodificação JSON
import 'package:http/http.dart' as http; // Para fazer requisições HTTP

class MapaSelect extends StatefulWidget {
  const MapaSelect({Key? key}) : super(key: key);

  @override
  _MapaSelectState createState() => _MapaSelectState();
}

class _MapaSelectState extends State<MapaSelect> {
  LatLng? _selectedLocation;
  String? _address;
  final LatLng _defaultLocation = const LatLng(40.657283, -7.914133);

  // Controlador do mapa
  final MapController _mapController = MapController();

  Future<void> _getAddressFromLatLng(LatLng latLng) async {
    final url = Uri.parse(
        'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latLng.latitude}&lon=${latLng.longitude}');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        _address = data['display_name'];
      });
    } else {
      setState(() {
        _address = 'Endereço não encontrado';
      });
    }
  }

  @override
  void initState() {
    super.initState();
    // Definir a localização padrão no início
    _selectedLocation = _defaultLocation;
    _getAddressFromLatLng(_defaultLocation);

    // Definir o centro e o zoom do mapa após a inicialização
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _mapController.move(_defaultLocation, 13.0); // Ajusta o zoom inicial
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: FlutterMap(
            mapController: _mapController, // Controlador do mapa
            options: MapOptions(
              onTap: (tapPosition, latLng) {
                setState(() {
                  _selectedLocation = latLng;
                });
                _getAddressFromLatLng(latLng);
              },
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                subdomains: ['a', 'b', 'c'],
              ),
              MarkerLayer(
                markers: [
                  // Marcador na localização selecionada ou padrão
                  if (_selectedLocation != null)
                    Marker(
                      point: _selectedLocation!,
                      width: 40,
                      height: 40,
                      child: const Icon(
                        Icons.location_pin,
                        color: Colors.red,
                        size: 40,
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
        if (_selectedLocation != null) 
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              'Coordenadas: ${_selectedLocation?.latitude}, ${_selectedLocation?.longitude}\n'
              'Endereço: $_address',
              textAlign: TextAlign.center,
            ),
          ),
        ElevatedButton(
          onPressed: () {
            Navigator.pop(context, {
              'latitude': _selectedLocation?.latitude,
              'longitude': _selectedLocation?.longitude,
              'address': _address,
            });
          },
          child: const Text('Confirmar Localização'),
        ),
      ],
    );
  }
}
