package ro.mit.stationmaster.trackElements;

/**
 * Created by Tudormi on 15/5/2015.
 */
public class IRSensor {

    /* o sa fie cate 2 senzori pe fiecare linie,unul de intrare si unul de iesire
    * atunci cand unul este declansat atunci linia este ocupata
    * iar daca este declansat si celalalt inseamna ca linia devine libera*/
    private int track;
    /* 0 - x; 1 - y */
    private int orientation;

    public IRSensor() {
    }


    public IRSensor(int lineNumber, int orientation) {
        this.track = lineNumber;
        this.orientation = orientation;
    }

    public int getTrack() {
        return track;
    }

    public void setTrack    (int track) {
        this.track = track;
    }

    public int getOrientation() {
        return orientation;
    }

    public void setOrientation(int orientation) {
        this.orientation = orientation;
    }
}
