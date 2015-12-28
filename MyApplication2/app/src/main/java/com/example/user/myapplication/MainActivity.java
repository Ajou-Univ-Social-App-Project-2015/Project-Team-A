package com.example.user.myapplication;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    private TextView quantityTextView;
    private int mQuantity = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // content
        setContentView(R.layout.activity_main);

        quantityTextView = (TextView)findViewById(R.id.tv_quantity);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }


    public void increment(View view) {
        mQuantity++;

        quantityTextView.setText(""+mQuantity);
        Log.d("MainActivity","increment");
    }

    public void decrement(View view) {

        if(mQuantity>0) {

            mQuantity--;
        }
        quantityTextView.setText(""+mQuantity);
        Log.d("MainActivity","decrement");

    }

    public void order(View view) {
        Log.d("MainActivity","order");

    }
}
