package ro.mit.stationmaster.layout;

/**
 * Created by Tudormi on 15/5/2015.
 */
public class IRSensor {

    /* o sa fie cate 2 senzori pe fiecare linie,unul de intrare si unul de iesire
    * atunci cand unul este declansat atunci linia este ocupata
    * iar daca este declansat si celalalt inseamna ca linia devine libera*/
    private int lineNumber;
    private String state;

    public IRSensor() {
    }

    public IRSensor(int lineNumber, String type) {
        this.lineNumber = lineNumber;
        this.state = type;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }

    public String getState() {
        return state;
    }

    public void setState(String type) {
        this.state = type;
    }
}
