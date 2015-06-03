package ro.mit.stationmaster.service;

import org.springframework.web.context.request.async.DeferredResult;
import ro.mit.stationmaster.layout.IRSensor;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * Created by tmatrescu on 3/6/2015.
 */
public class DeferredResultService implements Runnable{

    private final BlockingQueue<DeferredResult<IRSensor>> resultQueue = new LinkedBlockingQueue<DeferredResult<IRSensor>>();

    private Thread thread;

    private LinkedBlockingQueue<IRSensor> queue;

    @Override
    public void run() {

    }
}
