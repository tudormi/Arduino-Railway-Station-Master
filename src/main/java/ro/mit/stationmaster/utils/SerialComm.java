package ro.mit.stationmaster.utils;

import gnu.io.CommPortIdentifier;
import gnu.io.SerialPort;
import gnu.io.SerialPortEvent;
import gnu.io.SerialPortEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import ro.mit.stationmaster.layout.ArduinoMessageDispatcher;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Enumeration;

/**
 * Created by Tudormi on 11/5/2015.
 */
public class SerialComm implements SerialPortEventListener {

    @Autowired
    ArduinoMessageDispatcher arduinoMessageDispatcher;

    SerialPort serialPort = null;

    private static final String PORT_NAMES[] = {"COM3"};

    private static final String appName = "StationMaster";
    private BufferedReader input;
    private OutputStream output;

    private static final int TIME_OUT = 1000; // Port open timeout
    private static final int DATA_RATE = 19200; // Arduino serial port

    public boolean initialize() {
        System.out.println("start");
        try {
            CommPortIdentifier portId = null;
            Enumeration portEnum = CommPortIdentifier.getPortIdentifiers();

            System.out.println("Trying:");
            while (portId == null && portEnum.hasMoreElements()) {
                CommPortIdentifier currPortId = (CommPortIdentifier) portEnum.nextElement();
                System.out.println("port " + currPortId.getName());
                for (String portName : PORT_NAMES) {
                    if (currPortId.getName().equals(portName) || currPortId.getName().startsWith(portName)) {
                        serialPort = (SerialPort) currPortId.open(appName, TIME_OUT);
                        portId = currPortId;
                        System.out.println("Connected on port" + currPortId.getName());
                        break;
                    }
                }
            }

            if (portId == null || serialPort == null) {
                System.out.println("Oops... Could not connect to Arduino");
                return false;
            }

            serialPort.setSerialPortParams(DATA_RATE,
                    SerialPort.DATABITS_8,
                    SerialPort.STOPBITS_1,
                    SerialPort.PARITY_NONE);

            serialPort.addEventListener(this);
            serialPort.notifyOnDataAvailable(true);

            try {
                Thread.sleep(2000);
            } catch (InterruptedException ie) {
                ie.printStackTrace();
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("finish");
        return false;
    }

    public void sendData(String data) {
        try {
            System.out.println("Sending data: '" + data + "'");
            output = serialPort.getOutputStream();
            output.write(data.getBytes());
        } catch (Exception e) {
            System.err.println(e.toString());
            System.exit(0);
        }
    }

    public synchronized void close() {
        if (serialPort != null) {
            serialPort.removeEventListener();
            serialPort.close();
        }
    }

    @Override
    public synchronized void serialEvent(SerialPortEvent oEvent) {
        try {
            switch (oEvent.getEventType()) {
                case SerialPortEvent.DATA_AVAILABLE:
                    if (input == null) {
                        input = new BufferedReader(new InputStreamReader(serialPort.getInputStream()));
                    }
                    String inputLine = input.readLine();
//                    arduinoMessageDispatcher.parseMessageFromArduino(inputLine);
                    System.out.println(inputLine);
                    break;

                default:
                    break;
            }
        } catch (Exception e) {
            System.err.println(e.toString());
        }
    }
}

