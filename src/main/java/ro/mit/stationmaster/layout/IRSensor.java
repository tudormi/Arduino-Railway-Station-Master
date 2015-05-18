package ro.mit.stationmaster.layout;

/**
 * Created by Tudormi on 15/5/2015.
 */
public class IRSensor {

    /* o sa fie cate 2 senzori pe fiecare linie,unul de intrare si unul de iesire
    * atunci cand unul este declansat atunci linia este ocupata
    * iar daca este declansat si celalalt inseamna ca linia devine libera*/
    private int lineNumber;
    private String type;

    public IRSensor() {
    }

    public IRSensor(int lineNumber, String type) {
        this.lineNumber = lineNumber;
        this.type = type;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
